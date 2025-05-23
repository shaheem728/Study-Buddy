from django.http import HttpResponse, JsonResponse
from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.db.models import Q
from base.models import Room,Topic,Message,User
from .forms import RoomForm,UserForm,MyUserCreationForm
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
@csrf_exempt
def loginPage(request):
    page = 'login'
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request,email=email,password=password)    
        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
    context = {'page':page}    
    return render(request,'base/login_register.html',context)
def logoutUser(request):
    logout(request)
    return redirect('home')
def registerPage(request):
    page = 'register'
    form = MyUserCreationForm()
    if request.method == "POST":
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
           user = form.save(commit=False)
           user.username = user.username.lower()
           user.save()
           login(request,user)
           return redirect('home')
        else:
            messages.error(request, 'An error accurred during registration')
    context = {'page':page,'form':form}
    return render(request,'base/login_register.html',context)

def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    rooms = Room.objects.filter(Q(topic__name__icontains = q)|
                        Q(name__icontains = q)|
                        Q(description__icontains = q))
    room_count = rooms.count()
    topics = Topic.objects.all()[0:5]
    room_messages = Message.objects.filter(Q(room__topic__name__icontains=q))
    context = {'rooms':rooms,'topics':topics,'room_count':room_count,'room_messages':room_messages}
    return render(request, 'base/home.html',context)

def room(request,pk):
    room = Room.objects.get(id=pk)
    room_messages = room.message_set.all().order_by('-created')  #----------------
    participants = room.participants.all()
    if request.method == 'POST':
        message = Message.objects.create(
            user=request.user,
            room=room,
            body=request.POST.get('body', '').strip(),
            file = request.FILES.get('file'),
            )
        room.participants.add(request.user)
        return redirect('room', pk=room.id)
    context = {'room':room,'room_messages':room_messages,'participants':participants}
    return render(request,'base/room.html',context)

def userProfile(request,pk):
    user = User.objects.get(id=pk)
    rooms = user.room_set.all() #------
    room_message = user.message_set.all()
    topics = Topic.objects.all()
    context = {'user':user,'rooms':rooms,'room_message':room_message,'topics':topics}
    return render(request,'base/profile.html',context)
@login_required(login_url='login')
def createRoom(request):
    form = RoomForm()
    topics = Topic.objects.all()
    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, created = Topic.objects.get_or_create(name=topic_name)
        Room.objects.create(
            host=request.user,
            topic=topic,
            name=request.POST.get('name'),
            description=request.POST.get('description'),
         )
        return redirect('home')
    context = {'form':form,'topics':topics}
    return render(request,'base/room_form.html',context)


@login_required(login_url='login')
def updateRoom(request,pk):
    room = Room.objects.get(id=pk)
    form =  RoomForm(instance=room)
    if request.user != room.host:
        return HttpResponse('You are not the permission to update this room')
    if request.method == 'POST':
        topic_name = request.POST.get('topic')
        topic, created = Topic.objects.get_or_create(name=topic_name)
        room.name = request.POST.get('name')
        room.topic = topic
        room.description = request.POST.get('description')
        room.save()
        return redirect('home')
    context = {'form':form,'room':room}
    return render(request,'base/room_form.html',context)
    
# def upload_file(request):
#     if request.method == 'POST':
#         print(request)
#         file = request.FILES.get('file')
#         room_id = request.POST.get('room_id')  # Pass room ID from the frontend
#         try:
#             room = Room.objects.get(id=room_id)
#         except Room.DoesNotExist:
#             return JsonResponse({'error': 'Room does not exist'}, status=400)

#         if file:
#             message = Message.objects.create(
#                 user=request.user,
#                 room=room,
#                 body="File uploaded",
#                 file=file
#             )
#             return JsonResponse({'message': 'File uploaded successfully', 'file_url': message.file.url})
#         else:
#             return JsonResponse({'error': 'No file uploaded'}, status=400)
#     return JsonResponse({'error': 'Invalid request'}, status=400)


@login_required(login_url='login')
def deleteRoom(request,pk):
    room = Room.objects.get(id=pk)
    if request.user != room.host:
        return HttpResponse('You are not the permission to delete this room')
    if request.method == 'POST':
        room.delete()
        return redirect('home')
    return render(request,'base/delete.html',{'obj':room})

@login_required(login_url='login')
def deleteMessage(request,pk):
    message = Message.objects.get(id=pk)

    if request.user != message.user:
        return HttpResponse('You are not allowed here!!')
    
    if request.method == 'POST':
        message.delete()
        return redirect('home')
    return render(request,'base/delete.html',{'obj':message})
login_required(login_url='login')
def updateUser(request):
    user = request.user
    form = UserForm(instance=user)
    if request.method == 'POST':
        form = UserForm(request.POST,request.FILES,instance=user)
        if form.is_valid():
            form.save()
            return redirect('user-profile',pk=user.id)
    return render(request,'base/update-user.html',{'form':form})

def topicPage(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    topics = Topic.objects.filter(name__icontains=q)
    return render(request,'base/topics.html',{'topics':topics})

def activityPage(request):
    room_messages = Message.objects.all()
    return render(request,'base/activity.html',{'room_messages':room_messages})